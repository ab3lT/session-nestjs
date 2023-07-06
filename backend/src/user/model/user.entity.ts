import { Exclude } from "class-transformer";
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn, BeforeInsert, CreateDateColumn } from "typeorm";

@Entity("users")
export class User{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({unique: true})
    email: string;
    

    @Column()
    @Exclude()
    password: string;
    

    @CreateDateColumn({type: "timestamptz", default: () => "CURRENT_TIMESTAMP"})
    created_at: Date;

    
    @Column('boolean', {default: true})
    is_active : boolean 

    @Column({ type: 'jsonb', nullable: true })
    devices: { deviceId: string; userAgent: string; lastLoggedIn: Date }[];

    
}

