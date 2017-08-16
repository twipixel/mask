import VectorContainer from './VectorContainer';


export default class MaskVector extends VectorContainer {
    /**
     *
     * @param maskVO {MaskVO}
     */
    constructor(maskVO) {
        super(maskVO.url);
        this.maskVO = maskVO;
    }

}