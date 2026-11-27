import { Router, type Request, type Response } from 'express';
import { getHolidaysByYear, isNationalHoliday } from './holiday.service.js';
import { respuestaEstandar } from '../../utils/respuestaEstandar.js';

const router = Router();

const MIN_YEAR = 2000;
const MAX_YEAR = 2100;

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const yearQuery = req.query.year;
    const refreshQuery = req.query.refresh;
    const year = yearQuery === undefined ? new Date().getFullYear() : Number(yearQuery);

    if (
      (yearQuery !== undefined && (typeof yearQuery !== 'string' || !/^\d{4}$/.test(yearQuery)))
      || !Number.isInteger(year)
      || year < MIN_YEAR
      || year > MAX_YEAR
    ) {
      respuestaEstandar(res, 400, false, `El año debe estar entre ${MIN_YEAR} y ${MAX_YEAR}`);
      return;
    }

    if (refreshQuery !== undefined && refreshQuery !== 'true' && refreshQuery !== 'false') {
      respuestaEstandar(res, 400, false, "El parámetro refresh debe ser 'true' o 'false'");
      return;
    }

    const refresh = refreshQuery === 'true';
    const holidays = await getHolidaysByYear(year, refresh);
    respuestaEstandar(res, 200, true, `Feriados nacionales de ${year} obtenidos correctamente`, holidays);
  } catch (error) {
    console.error('Error al obtener feriados:', error);
    respuestaEstandar(res, 502, false, 'No se pudieron obtener los feriados nacionales');
  }
});

router.get('/check', async (req: Request, res: Response): Promise<void> => {
  try {
    const date = req.query.date;
    if (typeof date !== 'string' || !isValidDate(date)) {
      respuestaEstandar(res, 400, false, 'La fecha es inválida (usar YYYY-MM-DD)');
      return;
    }

    const year = Number(date.slice(0, 4));
    if (year < MIN_YEAR || year > MAX_YEAR) {
      respuestaEstandar(res, 400, false, `El año debe estar entre ${MIN_YEAR} y ${MAX_YEAR}`);
      return;
    }

    const holiday = await isNationalHoliday(date);
    respuestaEstandar(res, 200, true, 'Fecha consultada correctamente', {
      date,
      isHoliday: Boolean(holiday),
      holiday,
    });
  } catch (error) {
    console.error('Error al verificar feriado:', error);
    respuestaEstandar(res, 502, false, 'No se pudo consultar la fecha en el servicio de feriados');
  }
});

export default router;