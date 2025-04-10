import { motion } from "framer-motion";

interface LeadershipCardProps {
    name: string;
    role: string;
    image: string;
    index: number;
}

const LeadershipCard = ({ name, role, image, index }: LeadershipCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 + (index * 0.1) }}
            className="group"
        >
            <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors duration-300">
                <div className="relative w-24 h-24 rounded-full overflow-hidden neon-border">
                    <img
                        src={image}
                        alt={name}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                </div>
                <div>
                    <h3 className="font-medium">{name}</h3>
                    <p className="text-sm text-muted-foreground">{role}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default LeadershipCard; 