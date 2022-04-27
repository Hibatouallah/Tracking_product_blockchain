import React from "react";
import { Button } from "react-bootstrap";
import Glyphicon from  "react-bootstrap-tools";
import "./LoaderButton.css";

export default ({
  isLoading,
  text,
  loadingText,
  className = "",
  disabled = false,
  ...props
}) =>
  <Button
    className={`LoaderButton ${className}`}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading && <Glyphicon glyph="Input" className="spinning" />}
    {!isLoading ? text : loadingText}
  </Button>;