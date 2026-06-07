import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection("supabase");

    // Step 1: Get projects
    const projectsRes = await fetch("https://api.supabase.com/v1/projects", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const projects = await projectsRes.json();

    if (!projects || projects.length === 0) {
      return Response.json({ error: 'No Supabase projects found' }, { status: 404 });
    }

    const projectRef = projects[0].ref;
    const projectName = projects[0].name;

    // Step 2: Get schema via read-only query
    const schemaRes = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query/read-only`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          SELECT 
            t.table_name,
            c.column_name,
            c.data_type,
            c.character_maximum_length,
            c.is_nullable,
            c.column_default,
            pgd.description
          FROM information_schema.tables t
          JOIN information_schema.columns c 
            ON t.table_name = c.table_name AND t.table_schema = c.table_schema
          LEFT JOIN pg_catalog.pg_statio_all_tables st 
            ON st.relname = t.table_name
          LEFT JOIN pg_catalog.pg_description pgd 
            ON pgd.objoid = st.relid AND pgd.objsubid = c.ordinal_position
          WHERE t.table_schema = 'public'
            AND t.table_type = 'BASE TABLE'
          ORDER BY t.table_name, c.ordinal_position;
        `
      })
    });

    const schemaData = await schemaRes.json();

    // Group by table
    const tables = {};
    if (Array.isArray(schemaData)) {
      for (const row of schemaData) {
        if (!tables[row.table_name]) {
          tables[row.table_name] = [];
        }
        tables[row.table_name].push({
          column: row.column_name,
          type: row.data_type,
          maxLength: row.character_maximum_length,
          nullable: row.is_nullable === 'YES',
          default: row.column_default,
          description: row.description || null
        });
      }
    }

    return Response.json({
      project: projectName,
      ref: projectRef,
      tableCount: Object.keys(tables).length,
      tables
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});