## NOTE



### 스펙

- 마스크와 이미지 비율은 정비율로 조절 가능
- 마스크 오브젝트는 크기만 조절되고 회전되지 않는다.
- 배경 이미지는 마스크를 중심으로 사이즈 조절
- 배경이미지 회전
- 마스크를 적용하면 기존의 적용된 자르기, 스티커, 서명, 필터, 보정 등의 정보는 삭제
- 두께는 5단계로 조절 (1, 2, 3, 4, 5 단계)
- 두께는 INNER 처리
- 마스크의 최대, 최소 사이즈가 있다.
- 화면비율 풀지 못하고 배경 이미지는 사이즈 조절되면 그 상태로 남아 있도록 처리
- 마스크 형태는 이미지로 전달 받는다.
- 마스크 깨짐 때문에 SVG 로 전달 받고 D3로 Canvas 로 전환하는 것도 고려한다.
  - [d3.js svg 출력을 canvas에 image로 전환 방법](http://yehongj.tistory.com/59)
- Undo 고려


### 마스크 적용 과정

- 배경 이미지 캔버스 준비

  - ```javascript
    this.backgroundCanvas = document.createElement('canvas');
    this.backgroundCanvas.width = width;
    this.backgroundCanvas.height = height;

    // 딤드 배경 색상으로 그리기
    const backgroundContext = this.backgroundCanvas.getContext('2d');
    backgroundContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
    backgroundContext.fillRect(0, 0, width, height);
    ```

- Dimed 이미지 캔버스 준비

  - ```javascript
    this.dimedCanvas = document.createElement('canvas');
    this.dimedCanvas.width = width;
    this.dimedCanvas.height = height;

    this.dimedContext = this.dimedCanvas.getContext('2d');
    // 이미지 smoothed 설정
    const useSmoothed = false;
    this.dimedContext.mozImageSmoothingEnabled = useSmoothed;
    this.dimedContext.webkitImageSmoothingEnabled = useSmoothed;
    this.dimedContext.msImageSmoothingEnabled = useSmoothed;
    this.dimedContext.imageSmoothingEnabled = useSmoothed;
    ```

- Dimed 이미지 캔버스를 텍스쳐로 하는 스프라이트를 준비

  - ```javascript
    const dimed = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.dimedCanvas));
    ```

- 마스크 객체 상태를 반영하여 Dimed 이미지를 업데이트 합니다.

  - ```javascript
    // clear canvas
    this.dimedCanvas.width = this.canvasWidth;

    // 상태 저장
    this.dimedContext.save();

    // 배경 이미지 그리기
    this.dimedContext.drawImage(this.backgroundCanvas, 0, 0);

    //this.dimedContext.globalCompositeOperation = 'source-atop';
    //this.dimedContext.globalCompositeOperation = 'source-in';
    //this.dimedContext.globalCompositeOperation = 'source-out';
    //this.dimedContext.globalCompositeOperation = 'source-over';
    //this.dimedContext.globalCompositeOperation = 'destination-atop';
    //this.dimedContext.globalCompositeOperation = 'destination-in';
    this.dimedContext.globalCompositeOperation = 'destination-out';
    //this.dimedContext.globalCompositeOperation = 'destination-over';
    //this.dimedContext.globalCompositeOperation = 'lighter';
    //this.dimedContext.globalCompositeOperation = 'copy';
    //this.dimedContext.globalCompositeOperation = 'xor';

    // x, y 좌표로 이동
    this.dimedContext.translate(this.mask.x, this.mask.y);

    // 마스크 이미지 중심 좌표 만큼 뒤로 이동 (스케일값도 반영)
    this.dimedContext.translate(-this.maskCenterX * this.mask.scale.x, -this.maskCenterY * this.mask.scale.y);

    // 스케일
    this.dimedContext.scale(this.mask.scale.x, this.mask.scale.y);

    // 그리기
    this.dimedContext.drawImage(this.maskImage, 0, 0);

    // 이전 상태 복원
    this.dimedContext.restore();
    ```

### 프로토 타입 구현

- BitmapContainer (마스크, 배경 이미지)
  - 마스크
    - ​
  - 배경이미지
    - 배경 이미지는 최대 사이즈를 정하고 리사이즈 시 변경이 필요
- 충돌 체크
  - ​

