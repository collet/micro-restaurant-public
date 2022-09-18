import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { StartupLogicService } from './startup-logic.service';

import { Recipe } from '../schemas/recipe.schema';
import { PostEnum } from '../schemas/post-enum.schema';

describe('StartupLogicService', () => {
  let service: StartupLogicService;
  let connection: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StartupLogicService,
        {
          provide: getConnectionToken(),
          useValue: {
            models: {
              Recipe: {
                find: jest.fn(),
                create: jest.fn(),
              },
            },
          },
        },
      ],
    }).compile();

    service = module.get<StartupLogicService>(StartupLogicService);
    connection = module.get<Connection>(getConnectionToken());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a Recipe instance', () => {
    const mockShortName = 'my shortName';
    const mockPost = PostEnum.BAR;
    const mockCookingSteps = ['step 1', 'step 2'];
    const mockMeanCookingTimeInSec = 8;

    const recipe: Recipe = new Recipe();
    recipe.shortName = mockShortName;
    recipe.post = mockPost;
    recipe.cookingSteps = mockCookingSteps;
    recipe.meanCookingTimeInSec = mockMeanCookingTimeInSec;

    const createdRecipe = service.createRecipe(mockShortName, mockPost, mockCookingSteps, mockMeanCookingTimeInSec);
    expect(createdRecipe).toEqual(recipe);
  });

  it('should add a new recipe', async () => {
    const mockShortName = 'my shortName';
    const mockPost = PostEnum.BAR;
    const mockCookingSteps = ['step 1', 'step 2'];
    const mockMeanCookingTimeInSec = 8;

    const mockRecipe = {
      shortName: mockShortName,
      post: mockPost,
      cookingSteps: mockCookingSteps,
      meanCookingTimeInSec: mockMeanCookingTimeInSec,
    };

    jest.spyOn(connection.models.Recipe, 'find').mockResolvedValueOnce([]);
    jest.spyOn(connection.models.Recipe, 'create').mockImplementationOnce(() =>
      Promise.resolve(mockRecipe),
    );
    const newRecipe = await service.addRecipe(mockShortName, mockPost, mockCookingSteps, mockMeanCookingTimeInSec);
    expect(newRecipe).toEqual(mockRecipe);
  });

  it('should throw an error if recipe already exists', async () => {
    const mockShortName = 'my shortName';
    const mockPost = PostEnum.BAR;
    const mockCookingSteps = ['step 1', 'step 2'];
    const mockMeanCookingTimeInSec = 8;

    const mockRecipe = {
      shortName: mockShortName,
      post: mockPost,
      cookingSteps: mockCookingSteps,
      meanCookingTimeInSec: mockMeanCookingTimeInSec,
    };

    jest.spyOn(connection.models.Recipe, 'find').mockResolvedValueOnce([mockRecipe]);

    const testAddRecipe = async () => {
      await service.addRecipe(mockShortName, mockPost, mockCookingSteps, mockMeanCookingTimeInSec);
    };
    await expect(testAddRecipe).rejects.toThrow();
  });

  it ('should seed the db with some recipes', async () => {
    service.addRecipe = jest.fn();
    await service.onApplicationBootstrap();

    expect(service.addRecipe).toHaveBeenCalledTimes(30);
  });
});
