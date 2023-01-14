import { ApiBaseUrl } from "../../config";
export default function VideoPlayer(props) {
  return (
    <div style={{ "maxWidth": "80%", "maxHeight": "400px" }} >
      <video key={`${ApiBaseUrl}/stream/video?id=${props.id}`} controls controlsList="nodownload" autoPlay
        style={{ maxHeight: "inherit", maxWidth: "100%", borderRadius: "20px" }}>
        <source src={`${ApiBaseUrl}/stream/video?id=${props.id}`} type="video/mp4" />
      </video>
    </div>
  );
}
