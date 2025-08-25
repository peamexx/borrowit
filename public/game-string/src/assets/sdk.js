class BorrowitMessage {
  constructor(parentWindow, id) {
    this.window = parentWindow;
    this.itemId = id;
    this.version = 'v1.0';

    this._type = {
      LOAD: 'load', // 최초 로드
      START: 'start', // 게임 시작
      END: 'end', // 게임 끝
      CLOSE: 'close' // 종료
    };

    this._keys = {
      SHORT: 'short',     // 주관식
      MULTI: 'multiple',  // 객관식
      OX: 'ox'            // ox 문제
    };
  }

  static async load({ parentWindow, answer }) {
    if (!parentWindow) throw new Error('window가 없음.');

    return new Promise((res) => {
      parentWindow.postMessage({ type: 'load', answer: answer }, window.location.origin);

      const handler = (event) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.itemId) {
          window.removeEventListener('message', handler);

          res(new BorrowitMessage(parentWindow, event.data.itemId));
        }
      };
      window.addEventListener('message', handler);
    });
  }

  submit(props) {
    try {
      const isPass = this._validateAnswer(props.type, props.userAnswer);
      if (!isPass) {
        throw new Error(`SDK: 문제 답이 잘못되었습니다. 답을 확인해주세요. ${props.userAnswer}`);
      }

      this.window.postMessage({
        idx: props.idx,
        itemId: this.itemId,
        type: props.type,
        userAnswer: props.userAnswer,
      }, this.window.location.origin);
    } catch (e) {
      console.error(e.message);
    }
  }

  gameStart() {
    this._send({ type: this._type.START });
  }

  gameEnd() {
    this._send({ type: this._type.END });
  }

  _send(props) {
    try {
      this.window.postMessage({ itemId: this.itemId, type: props.type }, this.window.location.origin);
    } catch (e) {
      console.error(e.message);
    }
  }

  _validateAnswer(type, userAnswer) {
    switch (type) {
      case this._keys.SHORT:
        if (typeof userAnswer !== 'string') {
          return false;
        }
        return true;

      case this._keys.MULTI:
        if (!Array.isArray(userAnswer)) {
          return false;
        }
        return true;

      case this._keys.OX:
        if (!['o', 'x'].includes(userAnswer)) {
          return false;
        }
        return true;

      default:
        return false;
    }
  }

  get keys() {
    return this._keys;
  }
}

export default BorrowitMessage;
