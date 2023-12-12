type Logo = {
  url: string;
  width: number;
  height: number;
};

type Program = {
  id: string;
  event_id: Date;
  start_time: Date;
  end_time: Date;
  area: { id: string; name: string };
  service: {
    id: string;
    name: string;
    logo_s: Logo;
    logo_m: Logo;
    logo_l: Logo;
  };
  title: string;
  subtitle: string;
  content: string;
  act: string;
  genres: string[];
};

export type ProgramListResponse = {
  list: {
    g1: Program[];
  };
  error?: { code: number; message: string };
};
