import {
  ANNOTATION_LOCATION,
  ANNOTATION_SOURCE_LOCATION,
  Entity,
} from '@backstage/catalog-model';
import gitUrlParse from 'git-url-parse';

export const getHostname = (entity: Entity) => {
  const location =
    entity?.metadata.annotations?.[ANNOTATION_SOURCE_LOCATION] ??
    entity?.metadata.annotations?.[ANNOTATION_LOCATION];

  return location?.startsWith('url:')
    ? gitUrlParse(location.slice(4)).resource
    : undefined;
};
