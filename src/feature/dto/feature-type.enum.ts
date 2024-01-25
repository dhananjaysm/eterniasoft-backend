// feature-type.enum.ts
import { registerEnumType } from '@nestjs/graphql';

export enum FeatureType {
  PRODUCT = 'PRODUCT',
  PLAN = 'PLAN',
}

registerEnumType(FeatureType, {
  name: 'FeatureType',
});