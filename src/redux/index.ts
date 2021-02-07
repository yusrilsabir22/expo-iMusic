import { all, fork } from "redux-saga/effects";
import { watchYoutube } from "./saga";

export default function* rootSaga() {
    yield all([
        fork(watchYoutube)
    ]);
}