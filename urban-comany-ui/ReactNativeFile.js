class ReactNativeFile {
    constructor({ uri, type, name }) {
      this.uri = uri;
      this.type = type;
      this.name = name;
    }
  }
  
  const isReactNativeFile = (value) =>
    value instanceof ReactNativeFile;
  
  export { ReactNativeFile, isReactNativeFile }; 