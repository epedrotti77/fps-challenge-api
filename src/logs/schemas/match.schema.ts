import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Match extends Document {
  @Prop()
  matchId: string;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;

  @Prop({ type: [String] })
  players: string[];
}

export const MatchSchema = SchemaFactory.createForClass(Match);
