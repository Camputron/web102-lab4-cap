const Gallery = ({ images }) => {
  return (
    <div>
      <h3>Your Screenshot Gallery 🖼️</h3>
      {images && images.length > 0 ? (
        <ul className="gallery">
          {images.map((image, index) => (
            <li className="gallery-item" key={index}>
              <img
                className="gallery-image"
                src={image}
                alt={`Screenshot ${index + 1}`}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>No screenshots yet — take your first pic above!</p>
      )}
    </div>
  );
};

export default Gallery;
