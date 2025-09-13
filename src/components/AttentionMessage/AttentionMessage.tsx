import css from "./AttentionMessage.module.css";
export default function AttentionMessage() {
  return (
    <p className={css.text}>
      No movies exist with your search request. Please try again...
    </p>
  );
}
