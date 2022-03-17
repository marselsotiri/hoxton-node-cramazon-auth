import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const items: Prisma.ItemCreateInput[]= [
    {
        title: "T-Shirt",
        image: "https://static.zajo.net/content/mediagallery/zajo_dcat/image/product/types/X/9088.png",
        price: 15
    },
    {
        title: "Trousers",
        image: "https://www.7camicie.com/17969-big_default/trousers-chinos-premium-quality-beige-5788.jpg",
        price: 20
    },
    {
        title: "Shorts",
        image: "https://www.haglofs.com/dw/image/v2/BBTN_PRD/on/demandware.static/-/Sites-master-catalog-haglofs/default/dw81fcf64b/hi-res/6037753C5_S20_2_m1_grey.jpg?sw=1500&sh=1500&sm=fit",
        price: 35
    }
]
const users: Prisma.UserCreateInput[] = [
    {
        email: "marsel@email.com",
        password: bcrypt.hashSync('marsel'),
        name: "Marsel",
        orders: {
            create: [
                { item: { connect: { title: 'T-Shirt' } }, quantity: 100 },
                { item: { connect: { title: 'Shorts' } }, quantity: 50 },
                { item: { connect: { title: 'Trousers' } }, quantity: 20 }
            ]
        }
    },
    {
        email: "aldo@email.com",
        password: bcrypt.hashSync('aldo'),
        name: "Aldo",
        orders: {
            create: [
                {
                    item: {
                        connectOrCreate: {
                            where: { title: 'Shoes' },
                            create: { image: 'https://assets.ajio.com/medias/sys_master/root/hd4/h99/14092964397086/-1117Wx1400H-460455972-black-MODEL.jpg', title: 'Shoes', price: 10 }
                        }
                    },
                    quantity: 39
                }
            ]
        }
    },
    {
        email: "ben@email.com",
        password: bcrypt.hashSync('ben'),
        name: "Ben",
        orders: {
            create: [
                { item: { connect: { title: 'T-Shirt' } }, quantity: 60 },
                { item: { connect: { title: 'Shorts' } }, quantity: 54 },
                { item: { connect: { title: 'Trousers' } }, quantity: 14 }
            ]
        }
    }
]

async function createStuff(){
    for (const item of items){
        await prisma.item.create({data: item})
    }

    for (const user of users){
        await prisma.user.create({data: user})
    }
}

createStuff()