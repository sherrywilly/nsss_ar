const cv = require('opencv4nodejs');

const vCap = new cv.VideoCapture(0);
 
const delay = 10;
(async ()=>{
    while (true) {
        let frame = vCap.read();
        // loop back to start on end of stream reached
        if (frame.empty) {
          vCap.reset();
          frame = vCap.read();
          print(frame)
          console.log(frame)
         
        }
        // console.log(frame)
        const templateImage = await cv.imreadAsync(
          './pacman.png'
        );
      
        const matched = frame.matchTemplate(  templateImage,
          cv.TM_CCOEFF_NORMED)
          let maxVal = null;
          const minMax = matched.minMaxLoc();
          console.log(minMax)
      const x = minMax.maxLoc.x;
      const y = minMax.maxLoc.y;
      if (maxVal === null) {
        maxVal = minMax.maxVal;
      }
      const value = minMax.maxVal;
  
      if (value < maxVal * 0.9) {
        break;
      }  for (let i = 0; i < templateImage.rows; i++) {
        for (let j = 0; j < templateImage.cols; j++) {
          const tx = x + j - templateImage.cols / 2;
          const ty = y + i - templateImage.rows / 2;
          if (ty >= matched.rows || ty < 0) continue;
          if (tx >= matched.cols || tx < 0) continue;
          matched.set(ty, tx, 0);
        }
      }
      frame.drawRectangle(
        new cv.Rect(
            x,
            y,
            templateImage.cols,
            templateImage.rows
          ),
          new cv.Vec(0, 255, 0),
          5,
          cv.LINE_8
      )
  
        cv.imshow('OpenCV Node.js', frame);
        const key = cv.waitKey(delay); // Press ESC to quit
        if (key == 27) {
            break
        }
      }
})();