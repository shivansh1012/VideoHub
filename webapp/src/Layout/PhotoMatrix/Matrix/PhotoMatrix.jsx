import PhotoCard from "./PhotoCard.jsx";
import "./PhotoMatrix.css";

export default function PhotoMatrix(props) {
    return (
        <div className="container">
            <div className="animate-bottom photo-matrix">
                {
                    props.photoList.map((photo, index) => {
                        if (props.photoList.length === index + 1) {
                            return (
                                <div key={photo._id} ref={props.lastPhotoElementRef}>
                                    {PhotoCard(photo)}
                                </div>
                            );
                        } else {
                            return (
                                <div key={photo._id}>
                                    {PhotoCard(photo)}
                                </div>
                            );
                        }
                    })
                }
            </div>
        </div>
    )
}
