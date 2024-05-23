import whyDidYouRender from "@welldone-software/why-did-you-render";
import React from "react";
whyDidYouRender(React);

import { Buffer } from "buffer";
window.Buffer = window.Buffer ?? Buffer
console.log("buffer......")
