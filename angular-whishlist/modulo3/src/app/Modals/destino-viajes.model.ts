import{ v4 as uuid} from 'uuid';

export class DestinoViaje{
	public selected: boolean;
	servicios: string[];
	id = uuid();

	constructor(public nombre: string, public imagenUrl: string,  public votes: number = 0){
		this.servicios = ['almuerzo', 'desayuno', 'cena'];

	}
	isSelected(){
		return this.selected;
	}
	setSelected(s: boolean){
		this.selected = s;
	}

	voteUp(){
		this.votes++;
	}

	voteDown(){
		this.votes--;
	}
}