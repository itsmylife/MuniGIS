import TileLayer from "ol/layer/tile";
import Map from "ol/map";
import TileWMS from "ol/source/TileWMS";
import XYZ from "ol/source/xyz";
import View from "ol/view";
import * as React from "react";
import {connect} from "react-redux";
import { withRouter } from "react-router-dom";
import {Dispatch} from "redux";
import {setCoordinate, setExtent} from "../../redux/actions/map";
import {MapContext} from './MapContext'
import Layer from "./Layers/Layer";
import Layers from "./Layers";
import { ServiceModel } from "../../redux/actions/service";
import LayerContainer from "./Layers/LayerContainer";


interface IOlProps {
    mousePointer: any;
    history: any;
    map: Array<number>;
    extentChange: (center: number[]) => void;
}

class OLMap extends React.Component<IOlProps, any>  {

    private content: HTMLElement;
    private moved: boolean;
    private map: any;
    private view: any;
    private currentMousePointer: any;
    constructor(props: any) {
        super(props);
    }

    public componentDidMount() {

        let mapExtent = this.props.map
        
        let lat = 0
        let lon = 0
        let zoom = 2

        if(Array.isArray(mapExtent) && mapExtent.length === 3){
            lon = mapExtent[0]
            lat = mapExtent[1]
            zoom = mapExtent[2]
            console.log("gitdiii");
            
        }

        const content = this.content;
        this._onAnimationFrame = this._onAnimationFrame.bind(this);
        const view = new View({ center: [lon,lat], zoom: zoom });
        const map = new Map({
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    }),
                }),
            ],
            target: content,
            view,
        });

        this.map = map;
        this.view = view;
        map.on("pointermove", this._onMouseMove.bind(this));
        map.on("moveend", this._onMoveEnd.bind(this));
        this._onAnimationFrame();

        this.forceUpdate()
    }

    public _onAnimationFrame() {

        if (this.moved) {
            const {mousePointer} = this.props;
            mousePointer(this.currentMousePointer, this.view.getProjection().getCode());
            this.moved = true;
        }
        requestAnimationFrame(this._onAnimationFrame);
    }

    public _onMouseMove(e: any) {
        this.moved = true;
        this.currentMousePointer = e.coordinate;
    }

    public _onMoveEnd(e: any) {
        const {history} = this.props;
        const map = this.map;
        const view = map.getView();
        const center = view.getCenter();
        const zoom = view.getZoom();
        const adres = [...center, zoom];
        const {extentChange} = this.props;
        history.replace("@" + adres.join(","));
        extentChange(adres);
    }

    public _onContextMenu(e: any) {
        e.preventDefault();
    }

    public render() {

        const {children} = this.props
        return ( <React.Fragment>
                    <div
                            onContextMenu={this._onContextMenu}
                            style={{width: "100%", height: "100%"}}
                            ref={(r) => this.content = r} >
                    </div>
                    <MapContext.Provider value={ {map: this.map} } >
                        {children}
                        <LayerContainer />
                    </MapContext.Provider>
                </React.Fragment>)
    }
}

const mapToProps = (state: any) => ({
    map: state.map
});

const dispatchToState = (dispatch: Dispatch) => ({
    extentChange: (center: number[]) => dispatch( setExtent(center ) ),
    mousePointer: (coordinate: number[], epsg: string) => dispatch(setCoordinate(coordinate[0], coordinate[1], epsg)),
});

export default connect(mapToProps, dispatchToState)(withRouter(OLMap));
