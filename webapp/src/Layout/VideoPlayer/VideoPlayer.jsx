import { ApiBaseUrl } from "../../config";
export default function VideoPlayer(props) {
  return (
    <div style={{ "maxWidth": "80%", "maxHeight": "400px" }} >
      <video key={`${ApiBaseUrl}/video?id=${props.id}`} controls muted="muted" controlsList="nodownload"
        style={{ maxHeight: "inherit", maxWidth: "100%", borderRadius: "20px" }}>
        <source src={`${ApiBaseUrl}/video?id=${props.id}`} type="video/mp4" />
      </video>
    </div>
  );
}
