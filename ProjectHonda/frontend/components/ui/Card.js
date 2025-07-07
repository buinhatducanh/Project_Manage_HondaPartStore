export default function Card({ children, event, hoverScale}) {
  return <div className={`m-3 p-4 bg-white shadow rounded hover:scale-${hoverScale} cursor-pointer`} onClick={event} >{children}</div>;
}
