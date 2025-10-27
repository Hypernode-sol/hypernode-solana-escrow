from langchain.agents import initialize_agent, AgentType
from langchain.chat_models import ChatOpenAI
from langchain_hypernode_tool import (
StartHypernodeJobTool,
ReleaseHypernodePaymentTool,
)


llm = ChatOpenAI(temperature=0, model_name="gpt-4")
tools = [StartHypernodeJobTool(), ReleaseHypernodePaymentTool()]


agent = initialize_agent(
tools=tools,
llm=llm,
agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
verbose=True,
)


response = agent.run("Submit a job with CID 'bafy...xyz' to provider 'H3Gh...qv9B' locking 0.01 SOL")
print(response)
