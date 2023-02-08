import React from 'react'

interface Props {
    list: any[]
}
export default class Top10LosersView extends React.Component<Props> {
    constructor(p: Props) {
        super(p)
        this.state = {
            list: []
        }
    }
    private _renderPercent(percent: number) {
        if (percent < 0)//is negative
            return `${percent.toFixed(2)}%`
        //is positive, adds '+' sign to front
        return `+${percent.toFixed(2)}%`

    }
    private _renderHeader() {
        if (this.props.list.length === 0)
            return null
        return <p>Top 10 Losers</p>
    }
    private _renderList() {
        return this.props.list.map((e, i) => {
            return <p key={i}>{e.name}({e.symbol.toUpperCase()}) {e.current_price} {this._renderPercent(e.price_change_percentage_7d_in_currency)} </p>


        })
    }
    render(): React.ReactNode {
        return <div>
            {this._renderHeader()}
            <div>
                {this._renderList()}
            </div>
        </div>
    }
}