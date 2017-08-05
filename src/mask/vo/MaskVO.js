export default class
MaskVO
{
    /**
     * 마스크 설정 정보입니다.
     * @param url 마스크 이미지 주소
     * @param maxSize 최대 사이즈
     * @param defaultSize 기본 사이즈
     * @param minSize 최소 사이즈
     */
    constructor(url = '', maxSize = -1, defaultSize = -1, minSize = -1)
    {
        this.url = url;
        this.maxSize = maxSize;
        this.defaultSize = defaultSize;
        this.minSize = minSize;
        return this;
    }



    /**
     * 테스트 데이터로 셋팅 합니다.
     *
     * 0: 원
     * 1: 삼각
     * 2: 둥근사각
     * 3: 다각
     * 4: 별1
     * 5: 별2
     * 6: 둥근별
     * @param index
     */
    setTestData(index)
    {
        index = parseInt(index);

        switch (index) {
            case 0: // 원
                this.url = './../assets/img/mask-oval@3x.png';
                this.maxSize = '500x500';
                this.defaultSize = '300x300';
                this.minSize = '100x100';
                break;

            case 1: // 삼각
            default:
                this.url = './../assets/img/mask-triangle@3x.png';
                this.maxSize = '530x480';
                this.defaultSize = '330x300';
                this.minSize = '120x110';
                break;

            case 2: // 둥근사각
                this.url = './../assets/img/mask-round-squre@3x.png';
                this.maxSize = '500x500';
                this.defaultSize = '300x300';
                this.minSize = '120x120';
                break;

            case 3: // 다각
                this.url = './../assets/img/mask-polygon@3x.png';
                this.maxSize = '520x500';
                this.defaultSize = '335x320';
                this.minSize = '130x125';
                break;

            case 4: // 별1
                this.url = './../assets/img/mask-star@3x.png';
                this.maxSize = '500x477';
                this.defaultSize = '325x310';
                this.minSize = '120x114';
                break;

            case 5: // 별2
                this.url = './../assets/img/mask-star-2@3x.png';
                this.maxSize = '500x500';
                this.defaultSize = '320x320';
                this.minSize = '100x100';
                break;

            case 6: // 둥근별
                this.url = './../assets/img/mask-round-star@3x.png';
                this.maxSize = '500x500';
                this.defaultSize = '335x335';
                this.minSize = '100x100';
                break;
        }
    }

}