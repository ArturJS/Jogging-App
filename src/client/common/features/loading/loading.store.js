import { Container } from 'unstated';

class LoadingStore extends Container {
    state = {
        progress: 0,
        isLoading: false
    };

    startLoading() {
        if (!process.browser) {
            return;
        }

        this.setState({
            progress: 0,
            isLoading: true
        });
        this._runProgress();
    }

    finishLoading() {
        clearInterval(this.intervalId);
        this.setState({
            progress: 100,
            isLoading: false
        });
    }

    _increaseProgress = () => {
        this.setState(({ progress }) => {
            let step = 0;

            if (progress < 50) {
                step = 4;
            } else if (progress < 80) {
                step = 2;
            } else if (progress < 95) {
                step = 1;
            }

            return {
                progress: progress + step
            };
        });
    };

    _runProgress() {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this._increaseProgress, 100);
    }
}

export default new LoadingStore();
