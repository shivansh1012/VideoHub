export default function VideoPlayer(props) {
  return (
      <video key={`http://192.168.1.6:5000/video?id=${props.id}`} controls muted="muted" autoPlay style={{"maxWidth":"80%", "maxHeight":"50%", "borderRadius":"20px"}}>
        <source src={`http://192.168.1.6:5000/video?id=${props.id}`} type="video/mp4" />
      </video>
  );
}
