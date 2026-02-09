export default function Card({ card, onClick }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isOverdue = date < today && date.toDateString() !== today.toDateString();
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    let text = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (isToday) text = 'Today';
    if (isTomorrow) text = 'Tomorrow';

    return { text, isOverdue, isToday };
  };

  const dueInfo = formatDate(card.due_date);

  return (
    <div className="kanban-card" onClick={onClick}>
      {card.labels && card.labels.length > 0 && (
        <div className="kanban-card-labels">
          {card.labels.map((label, index) => (
            <span
              key={index}
              className="kanban-card-label"
              style={{ backgroundColor: label.color }}
              title={label.name}
            />
          ))}
        </div>
      )}

      <div className="kanban-card-title">{card.title}</div>

      {(card.description || dueInfo) && (
        <div className="kanban-card-meta">
          {card.description && (
            <span className="kanban-card-has-description" title="Has description">
              ≡
            </span>
          )}
          {dueInfo && (
            <span
              className={`kanban-card-due ${dueInfo.isOverdue ? 'overdue' : ''} ${
                dueInfo.isToday ? 'today' : ''
              }`}
            >
              📅 {dueInfo.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
