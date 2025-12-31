import type { Event } from "../data/events";
import "../styles/poster.css";

type Props = {
  event: Event;
};

export default function EventPoster({ event }: Props) {
  return (
    <div className={`poster poster--${event.theme} poster--${event.format}`}>
      {event.format === "image-feature" && (
        <>
          {event.acronym && (
            <h1 className="poster__acronym">{event.acronym}</h1>
          )}
          <div className="poster__image-wrapper">
            <img
              className="poster__image"
              src={event.image}
              alt={event.title}
            />
          </div>
          <div className="poster__info">
            <h2 className="poster__title">{event.title}</h2>
            <p className="poster__credit">{event.credit}</p>
            {event.tag && (
              <button className="poster__button">{event.tag}</button>
            )}
          </div>
          <footer className="poster__footer">
            <div className="poster__venue">{event.venue}</div>
            <div className="poster__date">{event.date}</div>
          </footer>
        </>
      )}

      {event.format === "text-statement" && (
        <>
          <h2 className="poster__statement">{event.title}</h2>
          <footer className="poster__footer">
            <div className="poster__venue">{event.venue}</div>
            <div className="poster__date">{event.date}</div>
          </footer>
          {event.acronym && (
            <h1 className="poster__acronym-bottom">{event.acronym}</h1>
          )}
        </>
      )}

      {event.format === "promo" && (
        <>
          <h2 className="poster__promo">{event.title}</h2>
          <footer className="poster__footer">
            <div className="poster__venue">{event.venue}</div>
            <div className="poster__date">{event.date}</div>
          </footer>
        </>
      )}
    </div>
  );
}
