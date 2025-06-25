import {
  guitars,
  brands,
  guitar_types,
  shapes,
  string_counts,
  pickup_configurations,
  fret_counts,
} from "@/generated/prisma";

export type GuitarWithRelations = guitars & {
  brands?: brands;
  guitar_types?: guitar_types;
  shape?: shapes;
  string_count?: string_counts;
  pickup_config?: pickup_configurations;
  fret_count?: fret_counts;
};
