import moment from 'moment';

// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an object ' + 
  'with the appropriate user keys.';


// **** Types **** //

export interface IPerfume {
  id: number;
  name: string;
  created: Date;
  cantListas: number;
  notas: String[];
  fechaSalida: Date;
  creador: String;
  precio: number;
  genero: "Masculino" | "Femenino" | "Unisex";

}


// **** Functions **** //
function new_(
  name?: string,
  created?: Date,
  id?: number, // id last cause usually set by db
): IPerfume {
  return {
    id: (id ?? -1),
    name: (name ?? ''),
    created: (created ? new Date(created) : new Date()),
  };
}

/**
 * Get user instance from object.
 */
function from(param: object): IPerfume {
  if (isPerfume(param)) {
    return new_(param.name, param.created, param.id);
  }
  throw new Error(INVALID_CONSTRUCTOR_PARAM);
}

/**
 * See if the param meets criteria to be a user.
 */
function isPerfume(arg: unknown): arg is IPerfume {
  return (
    !!arg &&
    typeof arg === 'object' &&
    'id' in arg && typeof arg.id === 'number' && 
    'name' in arg && typeof arg.name === 'string' &&
    'created' in arg && moment(arg.created as string | Date).isValid()
  );
}


// **** Export default **** //

export default {
  new: new_,
  from,
  isPerfume,
} as const;
