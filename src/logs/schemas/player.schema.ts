import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Player extends Document {
  @Prop()
  name: string;

  @Prop({ default: 0 })
  frags: number;

  @Prop({ default: 0 })
  deaths: number;

  @Prop({ default: [] })
  awards: string[];
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
