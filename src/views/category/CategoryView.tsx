import React, { CSSProperties } from 'react'
import { ThemeContext } from '../../constants'
import TimedButton from '../TimedButton'

import Top10GainersView from '../Top10GainersView'
import Top10LosersView from '../Top10LosersView'


//without date, there is no data
//with date, there is data, even if any list is empty
interface Props {
    gainersList: any[],
    loserList: any[],
    lastUpdate: Date | null
    onClickFetch: () => void
    onClickExport: () => void
    isLoading: boolean
    nextFetchDate: Date
}
const viewStyle: CSSProperties = {
    overflowY: 'scroll',
    width: '100%',
    height: '100%',
    position: 'relative'
}
const noDataViewStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
}
const actionsStyle: CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    display: 'flex',
    flexDirection: 'column'
}
const buttonStyle: CSSProperties = {
    marginBottom: '8px'
}
export default class CategoryView extends React.Component<Props> {
    static contextType = ThemeContext
    constructor(p: Props) {
        super(p)

    }

    _renderWhenEmpty() {
        return <div id="categoryNoData" style={noDataViewStyle}>
            <p>No Data</p>
            {this._renderFetchButton()}
        </div>
    }
    exportCSV = () => {
        console.log('CategoryView : trying to export csv')
        this.props.onClickExport()
    }
    private _renderLastUpdate() {
        return <span>Last update : {this.props.lastUpdate?.toLocaleString()}</span>
    }
    _renderFetchButton() {
        if (this.props.isLoading)
            return <button style={buttonStyle} onClick={this.props.onClickFetch} disabled><span className="loader" /></button>
        // return <button key="fetchBtn" style={buttonStyle} onClick={this.props.onClickFetch}>Fetch Data</button>
        return <TimedButton onClick={this.props.onClickFetch} targetDate={this.props.nextFetchDate}>Fetch Data</TimedButton>
    }
    _renderWithData() {
        // console.log('props:', this.props)
        return <div id="category" style={viewStyle}>
            <div id="actions" style={actionsStyle}>
                <button style={buttonStyle} onClick={this.exportCSV}>Export CSV</button>
                {this._renderFetchButton()}
            </div>
            <p>{this._renderLastUpdate()} </p>

            <Top10GainersView list={this.props.gainersList} />
            <Top10LosersView list={this.props.loserList} />
        </div>
    }
    hasNoData = () => {
        return this.props.lastUpdate ? false : true
    }
    render(): React.ReactNode {
        console.log('CategoryView render context', this.context)
        if (this.hasNoData())
            return this._renderWhenEmpty()

        return this._renderWithData()
    }
}