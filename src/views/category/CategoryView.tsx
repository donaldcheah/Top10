import React, { CSSProperties } from 'react'
import { ThemeContext } from '../../constants'
import TimedButton from '../TimedButton'

import Top10GainersView from '../Top10GainersView'
import Top10LosersView from '../Top10LosersView'

import coingecko_logo_text_light from '../../imgs/coingecko_logo_text_light.png'
import coingecko_logo_text_dark from '../../imgs/coingecko_logo_text_dark.png'
import coingecko_logo from '../../imgs/coingecko_logo.png'


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
const logoContainerStyle: CSSProperties = {
    display: 'flex',
    marginTop: '16px'
}
const logoStyle: CSSProperties = {
    marginLeft: '16px',
    width: '200px'
}
const logoTextStyle: CSSProperties = {
    fontWeight: "bold",
    fontFamily: 'sans-serif'
}
const spinnerLogoStyle: CSSProperties = {
    width: '48px'
}
export default class CategoryView extends React.Component<Props> {
    static contextType = ThemeContext

    _renderWhenEmpty() {
        const logoLink = this.context === 'light' ? coingecko_logo_text_light : coingecko_logo_text_dark
        return <div id="categoryNoData" style={noDataViewStyle}>
            <p>No Data</p>
            {this._renderFetchButton()}
            <div id="logoContainer" style={logoContainerStyle}>
                <p style={logoTextStyle}>Data From  </p><a href="https://www.coingecko.com/" target='_blank'><img style={logoStyle} src={logoLink} /></a>
            </div>

        </div>
    }
    exportCSV = () => {
        this.props.onClickExport()
    }
    private _renderLastUpdate() {
        return <span>Last update : {this.props.lastUpdate?.toLocaleString()}</span>
    }
    _renderFetchButton() {
        if (this.props.isLoading)
            return <button
                style={buttonStyle}
                onClick={this.props.onClickFetch}
                disabled>
                {/* <span className="loader" /> */}
                <img className='spinner_anim' style={spinnerLogoStyle} src={coingecko_logo} />
            </button>
        return <TimedButton onClick={this.props.onClickFetch} targetDate={this.props.nextFetchDate}>Fetch Data</TimedButton>
    }
    _renderWithData() {
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
        if (this.hasNoData())
            return this._renderWhenEmpty()

        return this._renderWithData()
    }
}