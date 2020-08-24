import { Migration } from '@mikro-orm/migrations';

export class Migration20200823215428 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "entry" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);');
  }

}
