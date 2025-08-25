import gameData from './data.js';
import BorrowitMessage from './sdk.js';

const GAME_DATA = gameData;
const UI = createUiModule();

window.addEventListener('load', async function () {
  try {
    const SDK = await BorrowitMessage.load({
      parentWindow: window.parent.opener,
      answer: [
        { idx: 0, results: GAME_DATA[0].isCorrect ? 'o' : 'x' },
        { idx: 1, results: GAME_DATA[1].isCorrect ? 'o' : 'x' },
        { idx: 2, results: GAME_DATA[2].isCorrect ? 'o' : 'x' },
      ]
    });
    let currentQuizIndex = 0;

    // start
    init();

    // main functions
    function init() {
      UI.startBtn.el.addEventListener('click', gameStart, { once: true });
      UI.resetBtn.el.addEventListener('click', reset, { once: true });
      UI.closeBtn.el.addEventListener('click', () => window.parent.close());
    }

    function gameStart() {
      SDK.gameStart();

      console.debug('gameStart: 게임 시작');
      UI.startBtn.fadeOut();

      UI.startBtn.el.addEventListener('animationend', () => {
        setupQuizRound();

        UI.quizBox.fadeIn();
      }, { once: true });
    }

    function setupQuizRound() {
      UI.quizText.el.innerHTML = getCurrentQuizHtml();

      if (currentQuizIndex === 0) {
        UI.oxBtn.onOclick((e) => handleAnswerSubmit.call(e, true));
        UI.oxBtn.onXclick((e) => handleAnswerSubmit.call(e, false));
      }

      UI.oxBtn.disable(false);
    }

    function handleAnswerSubmit(userAnswer) {
      UI.oxBtn.disable(true);

      const isCorrect = isAnswerCorrect(userAnswer);
      SDK.submit({ type: SDK.keys.OX, idx: currentQuizIndex, userAnswer: userAnswer ? 'o' : 'x' });

      UI.snapshotBg.fadeIn(isCorrect);

      UI.quizBox.fadeOut();
      UI.quizBox.el.addEventListener('animationend', () => {
        setupQuizAnswer();

        UI.answerBox.fadeIn();
      }, { once: true });
    }

    function setupQuizAnswer() {
      UI.answerText.el.innerHTML = getCurrentAnswerHtml();

      if (currentQuizIndex === 0) {
        UI.nextBtn.onclick(handleNextSubmit);
      }

      UI.nextBtn.disable(false);
    }

    async function handleNextSubmit() {
      UI.nextBtn.disable(true);

      const enableProcced = await setNextQuizIndex();
      if (!enableProcced.success) return;

      UI.snapshotBg.fadeOut();

      UI.answerBox.fadeOut();
      UI.answerBox.el.addEventListener('animationend', () => {
        setupQuizRound();

        UI.quizBox.fadeIn();
      }, { once: true });
    }

    function endGame() {
      SDK.gameEnd();

      UI.answerBox.fadeOut();
      UI.snapshotBg.fadeOut();

      setTimeout(() => {
        UI.endBox.fadeIn();
      }, 1000);
    }

    function reset() {
      console.debug('reset: 게임 리셋');
      document.body.style.pointerEvents = 'none';

      // 변수 리셋
      currentQuizIndex = 0;

      // 이벤트 리셋
      UI.oxBtn.offOclick();
      UI.oxBtn.offXclick();
      UI.nextBtn.offclick();

      // animation 리셋
      UI.endBox.fadeOut();
      UI.snapshotBg.fadeOut();
      UI.answerBox.fadeOut();
      UI.quizBox.fadeOut();

      // disable 리셋
      UI.nextBtn.disable(false);
      UI.oxBtn.disable(false);

      setTimeout(() => {
        document.body.removeAttribute('style');

        init();

        UI.startBtn.fadeIn();
      }, 1000);
    }

    // etc functions
    function getCurrentQuizHtml() {
      return GAME_DATA[currentQuizIndex].html;
    }

    function isAnswerCorrect(userAnswer) {
      return GAME_DATA[currentQuizIndex].isCorrect === userAnswer ? true : false;
    }

    function getCurrentAnswerHtml() {
      return GAME_DATA[currentQuizIndex].answerHtml;
    }

    function setNextQuizIndex() {
      return new Promise((res) => {
        if (currentQuizIndex == GAME_DATA.length - 1) {
          endGame();
          res({ success: false, code: 'END' });
        }

        currentQuizIndex = currentQuizIndex + 1;
        console.debug('게임 인덱스 증가: ', currentQuizIndex);
        res({ success: true });
      })
    }
  } catch (error) {
    console.debug(error);
  }
})

function createUiModule() {
  const resetBtnEl = document.querySelector('#reset-btn');
  const closeBtnEl = document.querySelector('#close-btn');
  const startBtnEl = document.querySelector('#start-btn');

  // 퀴즈 영역
  const quizBoxEl = document.querySelector('#quiz-box');
  const quizTextEl = quizBoxEl.querySelector('.quiz-text');
  const oBtnEl = quizBoxEl.querySelector('.o-btn');
  const xBtnEl = quizBoxEl.querySelector('.x-btn');

  // 답안 영역
  const answerBoxEl = document.querySelector('#answer-box');
  const answerTextEl = answerBoxEl.querySelector('.quiz-text');
  const nextBtnEl = answerBoxEl.querySelector('.next-btn');

  // 포토카드같은 사진
  const snapshotBgEl = document.querySelector('#snapshot-bg');

  // 종료 영역
  const endBoxEl = document.querySelector('#end-box');

  const handlers = new Map();

  return {
    resetBtn: {
      el: resetBtnEl
    },
    closeBtn: {
      el: closeBtnEl
    },
    startBtn: {
      el: startBtnEl,
      fadeIn: () => {
        startBtnEl.classList.remove('animate__fadeOut');
        startBtnEl.classList.add('animate__repeat-3');
      },
      fadeOut: () => {
        startBtnEl.classList.remove('animate__repeat-3');
        startBtnEl.classList.add('animate__fadeOut');
      }
    },
    quizBox: {
      el: quizBoxEl,
      fadeIn: () => {
        quizBoxEl.classList.remove('hide');
        quizBoxEl.classList.add('animate__fadeInUp');
      },
      fadeOut: () => {
        quizBoxEl.classList.add('animate__fadeOut');
        quizBoxEl.addEventListener('animationend', () => {
          quizBoxEl.classList.remove('animate__fadeOut', 'animate__fadeInUp');
          quizBoxEl.classList.add('hide');
        }, { once: true });
      }
    },
    quizText: {
      el: quizTextEl
    },
    oxBtn: {
      oBtnKey: 'oBtnEl',
      xBtnKey: 'xBtnEl',
      disable(type) {
        if (type) {
          oBtnEl.disabled = true;
          xBtnEl.disabled = true;
        } else {
          oBtnEl.disabled = false;
          xBtnEl.disabled = false;
        }
      },
      onOclick(handler) {
        if (handlers.get(this.oBtnKey)) {
          oBtnEl.removeEventListener('click', handlers.get(this.oBtnKey));
          return;
        }
        handlers.set(this.oBtnKey, handler);
        oBtnEl.addEventListener('click', handlers.get(this.oBtnKey));
      },
      offOclick() {
        if (handlers.get(this.oBtnKey)) {
          oBtnEl.removeEventListener('click', handlers.get(this.oBtnKey));
          handlers.delete(this.oBtnKey);
        }
      },
      onXclick(handler) {
        if (handlers.get(this.xBtnKey)) {
          xBtnEl.removeEventListener('click', handlers.get(this.xBtnKey));
          return;
        }
        handlers.set(this.xBtnKey, handler);
        xBtnEl.addEventListener('click', handlers.get(this.xBtnKey));
      },
      offXclick() {
        if (handlers.get(this.xBtnKey)) {
          xBtnEl.removeEventListener('click', handlers.get(this.xBtnKey));
          handlers.delete(this.xBtnKey);
        }
      }
    },
    answerBox: {
      el: answerBoxEl,
      fadeIn: () => {
        answerBoxEl.classList.remove('hide');
        answerBoxEl.classList.add('animate__fadeInUp');
      },
      fadeOut: () => {
        answerBoxEl.classList.add('animate__fadeOut');
        answerBoxEl.addEventListener('animationend', () => {
          answerBoxEl.classList.remove('animate__fadeOut', 'animate__fadeInUp');
          answerBoxEl.classList.add('hide');
        }, { once: true });
      }
    },
    answerText: {
      el: answerTextEl
    },
    nextBtn: {
      btnKey: 'nextBtnEl',
      el: nextBtnEl,
      disable(type) {
        if (type) {
          nextBtnEl.disabled = true;
        } else {
          nextBtnEl.disabled = false;
        }
      },
      onclick(handler) {
        if (handlers.get(this.btnKey)) {
          nextBtnEl.removeEventListener('click', handlers.get(this.btnKey));
          return;
        }
        handlers.set(this.btnKey, handler);
        nextBtnEl.addEventListener('click', handlers.get(this.btnKey));
      },
      offclick() {
        if (handlers.get(this.btnKey)) {
          nextBtnEl.removeEventListener('click', handlers.get(this.btnKey));
          handlers.delete(this.btnKey);
        }
      },
    },
    snapshotBg: {
      el: snapshotBgEl,
      fadeIn: (userAnswer) => {
        snapshotBgEl.dataset.ox = userAnswer ? 'o' : 'x';

        snapshotBgEl.classList.remove('hide');
        snapshotBgEl.classList.add('animate__rollIn');
      },
      fadeOut: () => {
        snapshotBgEl.classList.add('animate__rollOut');
        snapshotBgEl.addEventListener('animationend', () => {
          snapshotBgEl.classList.remove('animate__rollOut', 'animate__rollIn');
          snapshotBgEl.classList.add('hide');
        }, { once: true });
      }
    },
    endBox: {
      el: endBoxEl,
      fadeIn: () => {
        endBoxEl.classList.remove('hide');
        endBoxEl.classList.add('animate__fadeInUp');
      },
      fadeOut: () => {
        endBoxEl.classList.add('animate__fadeOut');
        endBoxEl.addEventListener('animationend', () => {
          endBoxEl.classList.remove('animate__fadeOut', 'animate__fadeInUp');
          endBoxEl.classList.add('hide');
        }, { once: true });
      }
    }
  }
}