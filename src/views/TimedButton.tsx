import React, { PropsWithChildren } from 'react'

interface Props {
    targetDate: Date
    onClick: () => void
}
interface State {
    secondsLeft: number
}
let index = 0;//incremented on constructor, to use as key to improve component mount performance
/*
    every second, check time left and set to state
    when time left is 0, disable check and enable button
*/
export default class TimedButton extends React.Component<PropsWithChildren<Props>, State>{
    private _intervalKey: any = null
    private _index;
    constructor(p: Props) {
        super(p)
        this.state = {
            secondsLeft: 0
        }
        this._index = index++
    }

    private _getTimeLeft() {
        return Math.floor((new Date(this.props.targetDate).getTime() - Date.now()) / 1000)
    }

    componentDidMount(): void {
        const secondsLeft = this._getTimeLeft()
        this.setState({ ...this.state, secondsLeft })
        if (secondsLeft > 0)
            this._intervalKey = setInterval(this._interval, 1000);
    }
    private _interval = () => {
        const secondsLeft = this._getTimeLeft()
        this.setState({ ...this.state, secondsLeft })
        if (secondsLeft <= 0) {
            clearInterval(this._intervalKey)
            this._intervalKey = null
        }
    }
    componentWillUnmount(): void {
        if (this._intervalKey)
            clearInterval(this._intervalKey)
    }
    render(): React.ReactNode {
        if (this.state.secondsLeft > 0)
            return <button
                id={`TimedButton${this._index}`}
                key={`TimedButton${this._index}`}
                disabled>
                {this.props.children}({this.state.secondsLeft}s)
            </button>

        return <button
            id={`TimedButton${this._index}`}
            key={`TimedButton${this._index}`}
            onClick={this.props.onClick}>
            {this.props.children}
        </button>
    }
}