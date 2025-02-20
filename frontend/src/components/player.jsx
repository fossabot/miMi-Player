import React, { useEffect, useState } from "react";

import play from "../assets/images/play.svg";
import pause from "../assets/images/pause.svg";
import angleDoubleLeft from "../assets/images/angle-double-left.svg";
import angleDoubleRight from "../assets/images/angle-double-right.svg";
import volumeMute from "../assets/images/volume-mute.svg";
import volumeOff from "../assets/images/volume-off.svg";
import bluetoothSVG from "../assets/images/bluetooth.svg";

import InputRangeComponent from "./input";
import { useDispatch, useSelector } from "react-redux";
import { asyncTrackSetVolume, asyncTrackToggle, asyncTrackVolumeMutedToggle } from "../actions/track";
import { msToPrecent } from "../utils/utils";

function PlayerComponentSeeker({ trackPrecent, deviceIsConnected }) {
    return (
        <div className={deviceIsConnected ? "controls__seek-container relative disabled" : "controls__seek-container relative"}>
            <InputRangeComponent
                className="controls__seek"
                min={0}
                max={100}
                step={0.02}
                value={trackPrecent}
                disabled={deviceIsConnected}
            />
        </div>
    )
}

function PlayerComponentControls({ isPlay, duration, position, volumeMuted, volume }) {
    const dispatch = useDispatch();

    function toggleTrackVolumeMuted() {
        dispatch(asyncTrackVolumeMutedToggle(!volumeMuted));
    }

    function asyncChangeVolume(event) {
        dispatch(asyncTrackSetVolume(event.target.valueAsNumber));
    }

    return (
        <div className="footer relative">
            <div className="controls">
                <div className="controls-item timer">
                    {duration}/{position}
                </div>
            </div>

            <div className="controls absolute absolute-center">
                <div className="controls-item play disabled">
                    <img src={angleDoubleLeft} />
                </div>
                <div className="controls-item play" onClick={() => {
                    dispatch(asyncTrackToggle());
                }}>
                    <img src={isPlay ? pause : play} />
                </div>
                <div className="controls-item play disabled">
                    <img src={angleDoubleRight} />
                </div>
            </div>

            <div className="controls">
                <div className="controls-item sound" onClick={toggleTrackVolumeMuted}>
                    <img src={volumeMuted ? volumeMute : volumeOff} />
                </div>
                <InputRangeComponent
                    hidden={volumeMuted}
                    className="volume-range"
                    type="range"
                    min={-8}
                    max={0}
                    step={0.02}
                    defaultValue={volume}
                    onChange={asyncChangeVolume}
                />
            </div>
        </div>
    )
}


function PlayerComponentBluetoothControls() {
    return (
        <div className="footer relative">
            <div className="controls">
                <div className="controls-item timer disabled">
                    --/--
                </div>
            </div>

            <div className="controls absolute absolute-center">
                <div className="controls-item play disabled">
                    <img src={angleDoubleLeft} />
                </div>
                <div className="controls-item play">
                    <img src={bluetoothSVG} />
                </div>
                <div className="controls-item play disabled">
                    <img src={angleDoubleRight} />
                </div>
            </div>

            <div className="controls">
                <div className="controls-item sound disabled">
                    <img src={volumeOff} />
                </div>
                <InputRangeComponent
                    className="volume-range"
                    type="range"
                    min={-8}
                    max={0}
                    step={0.02}
                    defaultValue={0}
                />
            </div>
        </div>
    )
}

function PlayerComponent() {
    const { bluetooth, track } = useSelector(({ bluetooth: { device }, track }) => ({ bluetooth: { device }, track }));

    const [trackPrecent, setTrackPrecent] = useState(0);

    useEffect(() => {
        setTrackPrecent(msToPrecent(track.positionMs, track.durationMs));
    }, [track.positionMs])

    return (
        <React.Fragment>
            <PlayerComponentSeeker
                trackPrecent={trackPrecent}
                deviceIsConnected={bluetooth.device.isConnected} />

            <div className="divider" />

            {bluetooth.device.isConnected
                ?
                <PlayerComponentBluetoothControls bluetooth={bluetooth} />
                :
                <PlayerComponentControls isPlay={track.isPlay} duration={track.duration} position={track.position} volumeMuted={track.volumeMuted} volume={track.volume} />
            }
        </React.Fragment>
    );
}

export default PlayerComponent;
