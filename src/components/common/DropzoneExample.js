// import React, { Component } from "react";
// import DropzoneComponent from "react-dropzone-component";
// import "dropzone/dist/min/dropzone.min.css";

// class Dropzone extends Component {
//   render() {
//     var componentConfig = { postUrl: 'no-url' };
//     var djsConfig = { autoProcessQueue: false }
//     var eventHandlers = { addedfile: (file) => console.log(file) }
//     return (
//       <DropzoneComponent
//         config={componentConfig}
//         eventHandlers={eventHandlers} className="dropify"
//         djsConfig={djsConfig}
//       />
//     );
//   }
// }

// export default Dropzone;

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
// import "dropzone/dist/min/dropzone.min.css"; 

const Dropzone = () => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log("Accepted files:", acceptedFiles);

    // Example: You can preview or upload here
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        console.log("File content preview:", reader.result);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
      "application/pdf": []
    }
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      {
        isDragActive
          ? <p>Drop the files here...</p>
          : <p>Drag & drop files here, or click to select files</p>
      }
    </div>
  );
};

export default Dropzone;
