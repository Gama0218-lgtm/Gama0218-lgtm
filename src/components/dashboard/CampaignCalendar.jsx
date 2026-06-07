import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const TODAY = new Date("2026-04-01");

// All calendar events — milestones + grants + outreach bookings
const INITIAL_EVENTS = [
  // Manuscript milestones
  { id:"m1", date:"2026-04-15", label:"Ch.40 Prayer Scene Complete",        category:"Manuscript", color:"red",    priority:"CRITICAL" },
  { id:"m2", date:"2026-04-20", label:"Joshua Sagasta Act II-III scene",    category:"Manuscript", color:"orange", priority:"HIGH"     },
  { id:"m3", date:"2026-04-25", label:"Sensory upgrades Ch.6/17/18",        category:"Manuscript", color:"orange", priority:"HIGH"     },
  { id:"m4", date:"2026-05-01", label:"MANUSCRIPT LOCK",                    category:"Manuscript", color:"red",    priority:"CRITICAL" },
  { id:"m5", date:"2026-05-10", label:"ARC to Beta Readers",                category:"Manuscript", color:"gold",   priority:"HIGH"     },
  { id:"m6", date:"2026-05-31", label:"📖 PUBLICATION DATE",                category:"Manuscript", color:"gold",   priority:"CRITICAL" },
  // Campaign events
  { id:"c1", date:"2026-05-05", label:"Press Kit Finalized",                category:"Campaign",   color:"blue",   priority:"HIGH"     },
  { id:"c2", date:"2026-05-18", label:"🏛 CHC Briefing — Congress",          category:"Campaign",   color:"gold",   priority:"CRITICAL" },
  { id:"c3", date:"2026-06-15", label:"Phase 1 Forensic Release",           category:"Campaign",   color:"teal",   priority:"HIGH"     },
  { id:"c4", date:"2026-07-01", label:"Educational Tour — SD/LA",           category:"Campaign",   color:"blue",   priority:"MED"      },
  // Grant deadlines
  { id:"g1", date:"2026-05-15", label:"NEH Public Scholars Deadline",       category:"Grant",      color:"purple", priority:"CRITICAL" },
  { id:"g2", date:"2026-06-01", label:"Mellon Foundation LOI",              category:"Grant",      color:"purple", priority:"HIGH"     },
  { id:"g3", date:"2026-07-15", label:"CA Arts Council Fellowship",         category:"Grant",      color:"teal",   priority:"HIGH"     },
  // Outreach
  { id:"o1", date:"2026-05-25", label:"Literary Agent Submissions (10)",    category:"Outreach",   color:"blue",   priority:"HIGH"     },
  { id:"o2", date:"2026-04-10", label:"Vietnam Veterans of America — pitch",category:"Outreach",   color:"blue",   priority:"MED"      },
  { id:"o3", date:"2026-04-18", label:"NPR Latino USA — story angle",       category:"Outreach",   color:"purple", priority:"MED"      },
];

function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = [];
  let day = 1 - firstDay;
  while (day <= daysInMonth) {
    const week = [];
    for (let d = 0; d < 7; d++, day++) {
      week.push(day >= 1 && day <= daysInMonth ? day : null);
    }
    weeks.push(week);
  }
  return weeks;
}

const MONTHS = [
  { year: 2026, month: 3, label: "April 2026" },
  { year: 2026, month: 4, label: "May 2026"   },
  { year: 2026, month: 5, label: "June 2026"  },
  { year: 2026, month: 6, label: "July 2026"  },
];
const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const CATEGORIES = ["All","Manuscript","Campaign","Grant","Outreach"];
const CAT_COLOR = { Manuscript:"red", Campaign:"gold", Grant:"purple", Outreach:"blue" };

function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
}

export default function CampaignCalendar() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [monthIdx, setMonthIdx] = useState(0);
  const [catFilter, setCatFilter] = useState("All");
  const [dragging, setDragging] = useState(false);

  const { year, month, label } = MONTHS[monthIdx];
  const weeks = buildCalendar(year, month);

  const filteredIds = new Set(
    (catFilter === "All" ? events : events.filter(e => e.category === catFilter)).map(e => e.id)
  );

  function eventsForDay(day) {
    if (!day) return [];
    const key = dateKey(year, month, day);
    return events.filter(e => e.date === key && filteredIds.has(e.id));
  }

  function onDragEnd(result) {
    setDragging(false);
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newDate = destination.droppableId; // droppableId = date string
    setEvents(prev => prev.map(e => e.id === draggableId ? { ...e, date: newDate } : e));
  }

  const todayKey = `${TODAY.getFullYear()}-${String(TODAY.getMonth()+1).padStart(2,"0")}-${String(TODAY.getDate()).padStart(2,"0")}`;

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          <button onClick={() => setMonthIdx(i => Math.max(0, i-1))} disabled={monthIdx === 0}
            className="px-2 py-1 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs">←</button>
          <span className="text-sm font-black font-mono text-foreground min-w-[100px] text-center">{label}</span>
          <button onClick={() => setMonthIdx(i => Math.min(MONTHS.length-1, i+1))} disabled={monthIdx === MONTHS.length-1}
            className="px-2 py-1 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs">→</button>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono border transition-all ${catFilter === c ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>
              {c !== "All" && <span className={`mr-1 text-${CAT_COLOR[c]}`}>●</span>}{c}
            </button>
          ))}
        </div>
        <span className="text-[9px] text-muted-foreground font-mono ml-auto">Drag events to reschedule</span>
      </div>

      {/* Legend */}
      <div className="flex gap-3 flex-wrap text-[9px] font-mono">
        {Object.entries(CAT_COLOR).map(([cat, col]) => (
          <span key={cat} className={`text-${col} flex items-center gap-1`}><span>●</span>{cat}</span>
        ))}
      </div>

      {/* Calendar Grid */}
      <DragDropContext onDragStart={() => setDragging(true)} onDragEnd={onDragEnd}>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {DAY_LABELS.map(d => (
              <div key={d} className="py-2 text-center text-[9px] font-bold text-muted-foreground font-mono border-r border-border last:border-r-0">{d}</div>
            ))}
          </div>
          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 border-b border-border last:border-b-0">
              {week.map((day, di) => {
                const key = day ? dateKey(year, month, day) : `empty-${wi}-${di}`;
                const dayEvents = eventsForDay(day);
                const isToday = day && dateKey(year, month, day) === todayKey;
                return (
                  <Droppable droppableId={key} key={key} isDropDisabled={!day}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[80px] p-1.5 border-r border-border last:border-r-0 transition-colors ${
                          !day ? "bg-background/30" :
                          snapshot.isDraggingOver ? "bg-accent/10" :
                          isToday ? "bg-gold/5" : ""
                        }`}
                      >
                        {day && (
                          <div className={`text-[10px] font-bold font-mono mb-1 ${
                            isToday ? "text-gold" : "text-muted-foreground"
                          }`}>
                            {isToday ? <span className="bg-gold text-background rounded-full px-1.5">{day}</span> : day}
                          </div>
                        )}
                        <div className="space-y-0.5">
                          {dayEvents.map((ev, ei) => (
                            <Draggable draggableId={ev.id} index={ei} key={ev.id}>
                              {(prov, snap) => (
                                <div
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                  {...prov.dragHandleProps}
                                  className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded leading-tight cursor-grab active:cursor-grabbing transition-all text-${ev.color} bg-${ev.color}/10 border border-${ev.color}/30 ${snap.isDragging ? "shadow-lg opacity-90 rotate-1" : ""}`}
                                >
                                  {ev.label}
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Upcoming Events List */}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mb-2">
          {label} — {(catFilter === "All" ? events : events.filter(e => e.category === catFilter))
            .filter(e => e.date.startsWith(`${year}-${String(month+1).padStart(2,"0")}`)).length} events
        </div>
        <div className="space-y-1.5">
          {(catFilter === "All" ? events : events.filter(e => e.category === catFilter))
            .filter(e => e.date.startsWith(`${year}-${String(month+1).padStart(2,"0")}`))
            .sort((a, b) => a.date.localeCompare(b.date))
            .map(ev => (
              <div key={ev.id} className="flex items-center gap-3 text-[10px]">
                <span className="font-mono text-muted-foreground min-w-[70px]">{ev.date.slice(5).replace("-", "/")}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono text-${ev.color} bg-${ev.color}/10 border border-${ev.color}/20 min-w-[70px] text-center`}>{ev.category}</span>
                <span className="text-foreground/80 font-sans flex-1">{ev.label}</span>
                <span className={`text-[8px] font-bold font-mono ${ev.priority === "CRITICAL" ? "text-red" : ev.priority === "HIGH" ? "text-orange" : "text-gold"}`}>{ev.priority}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}