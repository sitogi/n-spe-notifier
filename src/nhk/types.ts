// g1 は NHK 総合、s1 は BS1
export type Service = "g1" | "s1";

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
    [key in Service]: Program[];
  };
  error?: { code: number; message: string };
};
