import numpy as np
import math


def k_nearest(X, k, obj):
    sub_X = X[:, 0:-1].astype(float)
    
    mean = np.mean(sub_X, axis=0)
    std = np.std(sub_X, axis=0)
    sub_X = (sub_X - mean) / std
    
    obj_norm = (obj - mean) / std
    
    distances = [dist(obj_norm, sub_X[i]) for i in range(len(sub_X))]
    
    sorted_indices = np.argsort(distances)
    
    nearest_classes = X[sorted_indices[:k], -1]
    
    unique, counts = np.unique(nearest_classes, return_counts=True)
    object_class = unique[np.argmax(counts)]
    
    return int(object_class)


def dist(p1, p2):
    return math.sqrt(sum((p1 - p2) ** 2))