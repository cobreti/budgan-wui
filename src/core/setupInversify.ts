import 'reflect-metadata';
import {Container} from 'inversify';
import {ServicesTypes} from '@services/types';
import {OfxParser} from '@services/ofxParser';
import { OfxToBankAccount } from '@services/OfxToBankAccount'

const container = new Container();

container.bind(ServicesTypes.OfxParser).to(OfxParser);
container.bind(ServicesTypes.OfxToBankAccount).to(OfxToBankAccount);

export {
    container
}
