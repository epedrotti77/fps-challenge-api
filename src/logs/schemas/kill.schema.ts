import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Kill extends Document {
  @Prop()
  killer: string;

  @Prop()
  victim: string;

  @Prop()
  weapon: string;

  @Prop()
  timestamp: Date;

  @Prop()
  matchId: string;

  @Prop()
  killerTeam?: string;

  @Prop()
  victimTeam?: string;
}

export const KillSchema = SchemaFactory.createForClass(Kill);
