import pandas as pd
import random
import os

# Define seed for reproducibility
random.seed(42)

# Templates for real disaster news
real_templates = [
    "Severe {disaster} reported in {location}. Emergency services are on the scene.",
    "A magnitude {magnitude} {disaster} hit {location} today. Local authorities advise caution.",
    "Breaking: {disaster} has caused widespread damage in {location}. Evacuation orders in place.",
    "Casualties feared after a major {disaster} occurred in {location} early this morning.",
    "Search and rescue teams dispatched to {location} following a sudden {disaster}.",
    "Meteorological department issues warning for {disaster} in {location} and surrounding areas.",
    "Official update: {disaster} in {location} has been contained, but recovery efforts continue.",
    "Red Cross providing emergency aid to families affected by {disaster} in {location}.",
    "Power outages and transport disruptions reported in {location} due to ongoing {disaster}.",
    "Officials confirm at least {count} injured after {disaster} struck {location} last night."
]

# Templates for fake/suspicious rumors
fake_templates = [
    "UNBELIEVABLE: Government secret weapon caused the {disaster} in {location}!",
    "Alert! Zombie outbreak reported after the {disaster} in {location}. Spread this!",
    "Rumor says the {disaster} in {location} was staged by actors to control the population.",
    "Warning: {disaster} in {location} will destroy the entire continent by tomorrow! Run!",
    "SHOCKING video shows {disaster} in {location} was actually caused by aliens! Click here to watch.",
    "URGENT: Drinking bleach cures any radiation from the {disaster} in {location}!",
    "Leaked documents show that the {disaster} in {location} was predicted in a cartoon 10 years ago.",
    "Don't trust the news! There was no {disaster} in {location}, it's all a hoax by the media.",
    "Local reports claim a giant sea monster caused the {disaster} in {location}!",
    "Conspiracy theory: The {disaster} in {location} was simulated using CGI."
]

disasters_real = ["earthquake", "wildfire", "flood", "cyclone", "explosion", "tornado", "hurricane", "landslide"]
disasters_fake = ["alien invasion", "meteor strike", "volcanic eruption", "monster attack", "zombie virus", "government hoax"]
locations = ["California", "Tokyo", "London", "Texas", "Florida", "Sydney", "Mumbai", "Paris", "New York", "Jakarta", "Manila", "Beijing"]

def generate_data(num_samples=2000):
    data = []
    
    # Generate Real samples
    for _ in range(num_samples // 2):
        disaster = random.choice(disasters_real)
        location = random.choice(locations)
        template = random.choice(real_templates)
        
        text = template.format(
            disaster=disaster,
            location=location,
            magnitude=round(random.uniform(5.0, 8.5), 1),
            count=random.randint(10, 150)
        )
        data.append({"text": text, "label": 1}) # 1 for Real
        
    # Generate Fake samples
    for _ in range(num_samples // 2):
        # Occasionally use real disasters in fake rumors to make it realistic
        disaster = random.choice(disasters_real + disasters_fake)
        location = random.choice(locations)
        template = random.choice(fake_templates)
        
        text = template.format(
            disaster=disaster,
            location=location
        )
        data.append({"text": text, "label": 0}) # 0 for Fake
        
    df = pd.DataFrame(data)
    # Shuffle dataset
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    return df

if __name__ == "__main__":
    os.makedirs("dataset", exist_ok=True)
    df = generate_data(2500)
    df.to_csv("dataset/disaster_dataset.csv", index=False)
    print(f"Generated dataset with {len(df)} samples at 'dataset/disaster_dataset.csv'")
