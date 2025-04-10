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
        name: "Faculty Advisor",
        role: "Head of Department",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=200&h=200",
        order: 1
    },
    {
        id: "2",
        name: "President",
        role: "Student President",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=200&h=200",
        order: 2
    },
    {
        id: "3",
        name: "Vice President",
        role: "Student Vice President",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=200&h=200",
        order: 3
    },
    {
        id: "4",
        name: "Technical Head",
        role: "Technical Lead",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=crop&w=200&h=200",
        order: 4
    },
    {
        id: "5",
        name: "Event Coordinator",
        role: "Events Lead",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=crop&w=200&h=200",
        order: 5
    },
    {
        id: "6",
        name: "Public Relations",
        role: "PR Head",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=crop&w=200&h=200",
        order: 6
    },
    {
        id: "7",
        name: "Treasurer",
        role: "Finance Head",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=crop&w=200&h=200",
        order: 7
    },
    {
        id: "8",
        name: "Secretary",
        role: "Administrative Head",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=crop&w=200&h=200",
        order: 8
    }
]; 