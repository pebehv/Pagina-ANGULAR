import{
	reducerDestinosViajes,
	DestinoViajesState,
	intializeDestinoViajesState,
	InitMYDataAction,
	NuevoDestinoAction
} from './destino-viajes-state.model';

describe('reducerDestinosViajes', () => {
	it('should reduce init data', () =>{
		const prevState: DestinoViajesState = intializeDestinoViajesState();
		const action: InitMyDataAction = new InitMyDataAction(['destino 2'] );
		const newState: DestinoViajesState = reducerDestinosViajes(prevState, action);
		expect(newState.items.length).toEqual(2);
		expect(newState.items[0].nombre).toEqual('destino 1');
	} );
	it('should reduce new item added', () =>{
		const prevState: DestinoViajesState = intializeDestinoViajesState();
		const action: NuevoDestinoAction = new NuevoDestinoAction(new DestinoViaje('barcelona', 'url') );
		const newState: DestinoViajesState  = reducerDestinosViajes(prevState, action);
		expect(newState.items.length).toEqual(1);
		expect(newState.items[0].nombre).toEqual('barcelona');

	});
} );
