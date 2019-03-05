import numpy as np
import pandas as pd

np.random.seed(444)

df = pd.DataFrame([np.random.uniform(0,1,10) for x in range(0,10)]).transpose()
df.columns = ['N'+str(i) for i in range(0,10)]
df.to_json('nodes.json')