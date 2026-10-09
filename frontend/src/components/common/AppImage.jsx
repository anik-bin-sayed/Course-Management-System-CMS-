const AppImage = (props) => {
  const { fill, priority, style, ...imageProps } = props;
  delete imageProps.quality;
  delete imageProps.sizes;
  delete imageProps.unoptimized;

  return (
    <img
      {...imageProps}
      loading={priority ? "eager" : (imageProps.loading ?? "lazy")}
      style={
        fill
          ? {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              ...style,
            }
          : style
      }
    />
  );
};

export default AppImage;
