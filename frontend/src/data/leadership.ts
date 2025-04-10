export interface LeadershipMember {
    id: string;
    name: string;
    role: string;
    image: string;
    order: number;
}

export const leadershipTeam: LeadershipMember[] = [
    {
        id: "1",
        name: "President",
        role: "Student President",
        image: "president.jpg",
        order: 1
    },
    {
        id: "2",
        name: "General Secretary",
        role: "GS",
        image: "gs.JPG",
        order: 2
    },
    {
        id: "3",
        name: "Technical Head",
        role: "Technical Lead",
        image: "technical head.JPG",
        order: 3
    },
    {
        id: "4",
        name: "Cultural Head",
        role: "Cultural Lead",
        image: "cultural head.JPG",
        order: 4
    },
    {
        id: "5",
        name: "Co-Cultural Head 1",
        role: "Co-Cultural Lead",
        image: "co-cultural head.JPG",
        order: 5
    },
    {
        id: "6",
        name: "Co-Cultural Head 2",
        role: "Co-Cultural Lead",
        image: "co-cultural head 2.JPG",
        order: 6
    },
    {
        id: "7",
        name: "Co-Sports Secretary",
        role: "Sports Lead",
        image: "co-sports secreatary.jpg",
        order: 7
    },
    {
        id: "8",
        name: "Department LR",
        role: "Ladies Representative",
        image: "department Lr.JPG",
        order: 8
    },
    {
        id: "9",
        name: "Department CR",
        role: "Class Representative",
        image: "department cr.JPG",
        order: 9
    },
    {
        id: "12",
        name: "Social Media Head",
        role: "Social Media Manager",
        image: "social media head.JPG",
        order: 12
    },
    {
        id: "13",
        name: "Co-Social Media Head",
        role: "Social Media Co-Manager",
        image: "social media.JPG",
        order: 13
    },
    {
        id: "14",
        name: "Digital Magazine Head",
        role: "Content Lead",
        image: "digital magzine head.JPG",
        order: 14
    },
    {
        id: "15",
        name: "Co LR",
        role: "Co-Ladies Representative",
        image: "co LR.JPG",
        order: 15
    }
];